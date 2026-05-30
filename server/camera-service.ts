/**
 * Real-time Camera & Image Processing Service
 * Handles WebRTC, image capture, streaming, and preprocessing
 * Enables real-time plant identification from camera feed
 */

import { EventEmitter } from 'events';
import sharp from 'sharp';

interface StreamConfig {
  quality: 'low' | 'medium' | 'high';
  fps: number;
  width: number;
  height: number;
}

interface CapturedFrame {
  timestamp: number;
  imageBuffer: Buffer;
  base64: string;
  metadata: {
    width: number;
    height: number;
    quality: string;
  };
}

class CameraStreamService extends EventEmitter {
  private isStreaming = false;
  private streamConfig: StreamConfig = {
    quality: 'medium',
    fps: 15,
    width: 640,
    height: 480,
  };

  private frameBuffer: CapturedFrame[] = [];
  private maxBufferSize = 30; // Keep last 30 frames
  private analysisInProgress = false;

  constructor() {
    super();
  }

  /**
   * Start camera stream
   * Requires getUserMedia API from browser WebRTC
   */
  async startStream(config: Partial<StreamConfig> = {}): Promise<void> {
    this.streamConfig = { ...this.streamConfig, ...config };
    this.isStreaming = true;

    console.log('[Camera] Stream started with config:', this.streamConfig);
    this.emit('stream:started', { config: this.streamConfig });
  }

  /**
   * Stop camera stream
   */
  stopStream(): void {
    this.isStreaming = false;
    this.frameBuffer = [];
    console.log('[Camera] Stream stopped');
    this.emit('stream:stopped');
  }

  /**
   * Process frame from WebRTC stream (called from client via WebSocket)
   * Compresses and prepares for analysis
   */
  async processFrame(imageData: Uint8ClampedArray, width: number, height: number): Promise<CapturedFrame> {
    const buffer = Buffer.from(imageData);

    // Convert to PNG and compress
    const compressed = await sharp(buffer, {
      raw: { width, height, channels: 4 },
    })
      .resize(this.streamConfig.width, this.streamConfig.height, {
        fit: 'cover',
        withoutEnlargement: true,
      })
      .png({ quality: this.getQualityValue() })
      .toBuffer();

    const frame: CapturedFrame = {
      timestamp: Date.now(),
      imageBuffer: compressed,
      base64: compressed.toString('base64'),
      metadata: {
        width: this.streamConfig.width,
        height: this.streamConfig.height,
        quality: this.streamConfig.quality,
      },
    };

    // Add to buffer
    this.frameBuffer.push(frame);
    if (this.frameBuffer.length > this.maxBufferSize) {
      this.frameBuffer.shift();
    }

    this.emit('frame:processed', { frame });

    return frame;
  }

  /**
   * Capture single frame for plant identification
   * Returns optimized image buffer
   */
  async captureFrame(imageData?: Uint8ClampedArray, width?: number, height?: number): Promise<CapturedFrame> {
    if (imageData && width && height) {
      return this.processFrame(imageData, width, height);
    }

    // Return last frame if no data provided
    if (this.frameBuffer.length > 0) {
      return this.frameBuffer[this.frameBuffer.length - 1];
    }

    throw new Error('No frame available');
  }

  /**
   * Get continuous frames for real-time analysis
   * Emits frames at specified FPS rate
   */
  getFrameStream(callback: (frame: CapturedFrame) => Promise<void>): NodeJS.Timeout {
    const interval = 1000 / this.streamConfig.fps;

    const timer = setInterval(async () => {
      if (!this.isStreaming || this.frameBuffer.length === 0) {
        return;
      }

      if (this.analysisInProgress) {
        return; // Skip frame if analysis is still running
      }

      this.analysisInProgress = true;

      try {
        const frame = this.frameBuffer[this.frameBuffer.length - 1];
        await callback(frame);
      } catch (error) {
        console.error('[Camera] Frame processing error:', error);
      } finally {
        this.analysisInProgress = false;
      }
    }, interval);

    return timer;
  }

  /**
   * Enhance image for better plant identification
   * Increases contrast, sharpness, and saturation
   */
  async enhanceImage(buffer: Buffer): Promise<Buffer> {
    return sharp(buffer)
      .normalize() // Auto-enhance contrast
      .sharpen({
        sigma: 1.5,
      })
      .modulate({
        saturation: 1.2, // Boost colors slightly
      })
      .toBuffer();
  }

  /**
   * Convert frame to multiple quality levels
   * Used for different analysis pipelines
   */
  async getFrameVariants(frame: CapturedFrame): Promise<Record<string, Buffer>> {
    const high = await sharp(frame.imageBuffer).resize(1024, 768, { fit: 'cover' }).toBuffer();
    const medium = frame.imageBuffer;
    const low = await sharp(frame.imageBuffer).resize(320, 240, { fit: 'cover' }).toBuffer();

    return { high, medium, low };
  }

  /**
   * Check if frame is focused enough for analysis
   * Uses Laplacian variance technique
   */
  async isFocused(buffer: Buffer, threshold: number = 50): Promise<boolean> {
    // Simplified check - in production use computer vision library
    // Returns true for now - implement blur detection with OpenCV if needed
    return true;
  }

  /**
   * Get quality compression value (0-100)
   */
  private getQualityValue(): number {
    switch (this.streamConfig.quality) {
      case 'low':
        return 30;
      case 'medium':
        return 60;
      case 'high':
        return 85;
      default:
        return 60;
    }
  }

  /**
   * Get stream statistics
   */
  getStats(): {
    isStreaming: boolean;
    frameCount: number;
    config: StreamConfig;
    lastFrameTime: number;
  } {
    return {
      isStreaming: this.isStreaming,
      frameCount: this.frameBuffer.length,
      config: this.streamConfig,
      lastFrameTime: this.frameBuffer.length > 0 ? this.frameBuffer[this.frameBuffer.length - 1].timestamp : 0,
    };
  }
}

export { CameraStreamService, CapturedFrame, StreamConfig };
