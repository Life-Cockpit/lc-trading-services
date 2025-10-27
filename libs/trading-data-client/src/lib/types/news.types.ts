/**
 * Represents a news article thumbnail resolution
 */
export interface NewsThumbnailResolution {
  /** URL of the thumbnail image */
  url: string;
  /** Width in pixels */
  width: number;
  /** Height in pixels */
  height: number;
  /** Tag identifier for the resolution */
  tag: string;
}

/**
 * Represents a news article
 */
export interface NewsData {
  /** Unique identifier for the news article */
  uuid: string;
  /** Article title */
  title: string;
  /** Publisher name */
  publisher: string;
  /** Link to the full article */
  link: string;
  /** Publication timestamp */
  providerPublishTime: Date;
  /** Article type */
  type: string;
  /** Optional thumbnail image with multiple resolutions */
  thumbnail?: {
    resolutions: NewsThumbnailResolution[];
  };
  /** Related ticker symbols */
  relatedTickers?: string[];
}

/**
 * Parameters for fetching news
 */
export interface NewsParams {
  /** Search query or symbol to get news for */
  query: string;
  /** Maximum number of news articles to return (default: 10) */
  count?: number;
}
