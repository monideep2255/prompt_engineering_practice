import { YoutubeTranscript } from 'youtube-transcript';

export class YouTubeProcessorService {
  
  async extractTranscriptFromUrl(url: string): Promise<{ title: string; content: string }> {
    try {
      // Extract video ID from YouTube URL
      const videoId = this.extractVideoId(url);
      if (!videoId) {
        throw new Error('Invalid YouTube URL format');
      }

      // Get transcript
      const transcript = await YoutubeTranscript.fetchTranscript(videoId);
      
      // Combine transcript text
      const content = transcript
        .map(item => item.text)
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim();

      if (content.length < 100) {
        throw new Error('Transcript too short or unavailable');
      }

      // Generate title from URL or use video ID
      const title = this.generateTitleFromUrl(url, videoId);

      return {
        title,
        content
      };

    } catch (error) {
      console.error('YouTube transcript extraction error:', error);
      throw new Error(
        error instanceof Error 
          ? `Failed to extract transcript: ${error.message}` 
          : 'Failed to extract YouTube transcript'
      );
    }
  }

  private extractVideoId(url: string): string | null {
    // Handle various YouTube URL formats
    const patterns = [
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&\n?#]+)/,
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([^&\n?#]+)/,
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/v\/([^&\n?#]+)/,
      /(?:https?:\/\/)?youtu\.be\/([^&\n?#]+)/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }

    return null;
  }

  private generateTitleFromUrl(url: string, videoId: string): string {
    // Extract channel or video info from URL if possible
    const urlObj = new URL(url);
    const channelMatch = url.match(/\/c\/([^\/]+)|\/channel\/([^\/]+)|\/user\/([^\/]+)/);
    
    if (channelMatch) {
      const channelName = channelMatch[1] || channelMatch[2] || channelMatch[3];
      return `YouTube: ${channelName} - ${videoId}`;
    }

    return `YouTube Video: ${videoId}`;
  }

  isYouTubeUrl(url: string): boolean {
    const youtubePatterns = [
      /^https?:\/\/(www\.)?(youtube\.com|youtu\.be)/,
    ];

    return youtubePatterns.some(pattern => pattern.test(url));
  }
}

export const youtubeProcessor = new YouTubeProcessorService();