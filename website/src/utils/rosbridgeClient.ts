// website/src/utils/rosbridgeClient.ts

// Interface for ROSBridge client options
interface RosbridgeOptions {
  url: string;
  timeout?: number;
  onConnected?: () => void;
  onDisconnected?: () => void;
  onError?: (error: Event) => void;
}

// Interface for ROSBridge message
interface RosbridgeMessage {
  op: string;
  id?: string;
  topic?: string;
  type?: string;
  msg?: any;
  service?: string;
  args?: any;
}

// Class for ROSBridge client
class RosbridgeClient {
  private socket: WebSocket | null = null;
  private isConnected: boolean = false;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private reconnectInterval: number = 3000;
  private url: string;
  private timeout: number;
  private onConnectedCallback?: () => void;
  private onDisconnectedCallback?: () => void;
  private onErrorCallback?: (error: Event) => void;
  private messageQueue: RosbridgeMessage[] = [];
  private subscriptions: Map<string, (msg: any) => void> = new Map();

  constructor(options: RosbridgeOptions) {
    this.url = options.url;
    this.timeout = options.timeout || 5000;
    this.onConnectedCallback = options.onConnected;
    this.onDisconnectedCallback = options.onDisconnected;
    this.onErrorCallback = options.onError;
  }

  connect(): void {
    if (this.isConnected) return;

    try {
      this.socket = new WebSocket(this.url);

      this.socket.onopen = () => {
        console.log('[ROSBridge] Connected to ROSBridge server');
        this.isConnected = true;
        this.reconnectAttempts = 0; // Reset attempts on successful connection
        if (this.onConnectedCallback) this.onConnectedCallback();

        // Send any queued messages
        this.flushQueue();
      };

      this.socket.onclose = (event) => {
        console.log(`[ROSBridge] Disconnected from server: ${event.reason || 'Unknown reason'}`);
        this.isConnected = false;

        // Attempt to reconnect if not manually disconnected
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
          setTimeout(() => {
            this.reconnectAttempts++;
            console.log(`[ROSBridge] Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
            this.connect();
          }, this.reconnectInterval);
        }

        if (this.onDisconnectedCallback) this.onDisconnectedCallback();
      };

      this.socket.onerror = (error) => {
        console.error('[ROSBridge] Connection error:', error);
        if (this.onErrorCallback) this.onErrorCallback(error);
      };

      this.socket.onmessage = (event) => {
        try {
          const message: RosbridgeMessage = JSON.parse(event.data);
          this.handleMessage(message);
        } catch (err) {
          console.error('[ROSBridge] Error parsing message:', err);
        }
      };
    } catch (error) {
      console.error('[ROSBridge] Failed to create WebSocket:', error);
      if (this.onErrorCallback) this.onErrorCallback(error as Event);
    }
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.close();
      this.isConnected = false;
      this.reconnectAttempts = this.maxReconnectAttempts; // Prevent auto-reconnect
    }
  }

  // Publish a message to a topic
  publish(topic: string, message: any, messageType: string): void {
    const rosMsg: RosbridgeMessage = {
      op: 'publish',
      topic,
      msg: message
    };

    if (this.isConnected) {
      this.sendMessage(rosMsg);
    } else {
      console.warn(`[ROSBridge] Not connected, queuing message for topic: ${topic}`);
      this.messageQueue.push(rosMsg);
    }
  }

  // Subscribe to a topic
  subscribe(topic: string, callback: (msg: any) => void, messageType?: string): void {
    this.subscriptions.set(topic, callback);

    const rosMsg: RosbridgeMessage = {
      op: 'subscribe',
      topic,
      type: messageType
    };

    if (this.isConnected) {
      this.sendMessage(rosMsg);
    } else {
      console.warn(`[ROSBridge] Not connected, queuing subscription for topic: ${topic}`);
      this.messageQueue.push(rosMsg);
    }
  }

  // Unsubscribe from a topic
  unsubscribe(topic: string): void {
    this.subscriptions.delete(topic);

    const rosMsg: RosbridgeMessage = {
      op: 'unsubscribe',
      topic
    };

    if (this.isConnected) {
      this.sendMessage(rosMsg);
    }
  }

  // Call a service
  callService(service: string, args?: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const id = `call_service_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const rosMsg: RosbridgeMessage = {
        op: 'call_service',
        service,
        args,
        id
      };

      if (this.isConnected) {
        // Set up temporary handler for the response
        const responseHandler = (msg: any) => {
          if (msg.id === id) {
            if (msg.result) {
              resolve(msg.values);
            } else {
              reject(new Error(msg.error_msg || 'Service call failed'));
            }
            // Clean up the temporary handler
            this.socket!.removeEventListener('message', responseHandler);
          }
        };

        // Send the service call
        this.sendMessage(rosMsg);
      } else {
        reject(new Error('Not connected to ROSBridge'));
      }
    });
  }

  // Send a message over the WebSocket
  private sendMessage(message: RosbridgeMessage): void {
    if (this.socket && this.isConnected) {
      this.socket.send(JSON.stringify(message));
    }
  }

  // Flush any queued messages
  private flushQueue(): void {
    if (this.isConnected && this.messageQueue.length > 0) {
      while (this.messageQueue.length > 0) {
        const message = this.messageQueue.shift()!;
        this.sendMessage(message);
      }
    }
  }

  // Handle incoming messages
  private handleMessage(message: RosbridgeMessage): void {
    if (message.op === 'publish' && message.topic) {
      // Handle published message
      const callback = this.subscriptions.get(message.topic);
      if (callback) {
        callback(message.msg);
      }
    } else if (message.op === 'service_response') {
      // Handle service response - this would be implemented with a specific handler
      console.log('[ROSBridge] Service response:', message);
    } else if (message.op === 'set_level' || message.op === 'status') {
      // Handle status messages
      console.log('[ROSBridge] Status message:', message);
    }
  }

  // Check if client is connected
  isConnectedToRos(): boolean {
    return this.isConnected;
  }

  // Get connection status
  getConnectionStatus(): string {
    return this.isConnected ? 'connected' : 'disconnected';
  }
}

export default RosbridgeClient;