import { YoutubeTranscript } from 'youtube-transcript';

export class YouTubeProcessorService {
  
  async extractTranscriptFromUrl(url: string): Promise<{ title: string; content: string }> {
    try {
      // Extract video ID from YouTube URL
      const videoId = this.extractVideoId(url);
      if (!videoId) {
        throw new Error('Invalid YouTube URL format');
      }

      // Get transcript with better error handling
      let transcript;
      try {
        transcript = await YoutubeTranscript.fetchTranscript(videoId);
      } catch (transcriptError) {
        // Try alternative approach or provide more helpful error
        if (transcriptError instanceof Error) {
          if (transcriptError.message.includes('Transcript is disabled')) {
            throw new Error('Video transcript is disabled by the creator');
          } else if (transcriptError.message.includes('Video unavailable')) {
            throw new Error('Video is unavailable or private');
          } else if (transcriptError.message.includes('No transcript')) {
            throw new Error('No transcript available for this video');
          }
        }
        throw new Error('Unable to fetch transcript. Video may be private, age-restricted, or have no transcript available');
      }

      if (!transcript || transcript.length === 0) {
        throw new Error('No transcript data available for this video');
      }
      
      // Combine transcript text
      const content = transcript
        .map(item => item.text)
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim();

      if (content.length < 50) {
        throw new Error('Transcript content is too short to process (minimum 50 characters)');
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
          ? error.message
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