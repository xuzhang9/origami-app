import * as cheerio from 'cheerio';

export async function scrapeOrigamiSite(query: string): Promise<string> {
  try {
    // Try Origami Resource Center first
    const searchQuery = encodeURIComponent(query);
    const url = `https://origami-resource-center.com/?s=${searchQuery}`;

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; OrigamiApp/1.0)',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Remove script and style tags
    $('script, style, nav, footer, header').remove();

    // Extract main content
    const content = $('main, article, .content, .post').text() || $('body').text();

    // Get image URLs
    const images: string[] = [];
    $('img').each((_, elem) => {
      const src = $(elem).attr('src');
      if (src) {
        images.push(src);
      }
    });

    // Combine text content with image info
    let result = content.trim();
    if (images.length > 0) {
      result += '\n\nImages found:\n' + images.join('\n');
    }

    return result;
  } catch (error) {
    console.error('Error scraping origami site:', error);

    // Fallback: return a generic message
    return `Unable to scrape instructions for "${query}". Please try a different search term or check the original websites manually.`;
  }
}

export async function scrapeOrigamiMe(query: string): Promise<string> {
  try {
    const searchQuery = encodeURIComponent(query);
    const url = `https://origami.me/search/?q=${searchQuery}`;

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; OrigamiApp/1.0)',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    $('script, style, nav, footer, header').remove();

    const content = $('main, article, .diagram, .instructions').text() || $('body').text();

    return content.trim();
  } catch (error) {
    console.error('Error scraping origami.me:', error);
    return '';
  }
}
