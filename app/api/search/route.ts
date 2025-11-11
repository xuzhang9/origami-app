import { NextRequest, NextResponse } from 'next/server';
import { getCachedOrigami, cacheOrigami } from '@/lib/database';
import { scrapeOrigamiSite } from '@/lib/scraper';
import { parseOrigamiInstructions } from '@/lib/openai';

export async function POST(request: NextRequest) {
  try {
    const { query, apiKey } = await request.json();

    if (!query || typeof query !== 'string') {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    // Check cache first
    try {
      const cached = await getCachedOrigami(query);
      if (cached) {
        return NextResponse.json({
          success: true,
          origami: cached,
          cached: true,
        });
      }
    } catch (cacheError) {
      console.error('Cache check error:', cacheError);
      // Continue even if cache fails
    }

    // If no API key provided, return error with helpful message
    if (!apiKey) {
      return NextResponse.json({
        error: 'No API key configured. Please add your OpenAI API key in Settings to use AI search!',
        needsApiKey: true,
      }, { status: 400 });
    }

    // Scrape origami website
    const scrapedContent = await scrapeOrigamiSite(query);

    if (!scrapedContent || scrapedContent.length < 50) {
      return NextResponse.json({
        error: `Couldn't find instructions for "${query}". Try a different search term!`,
      }, { status: 404 });
    }

    // Parse with AI
    try {
      const origami = await parseOrigamiInstructions(scrapedContent, query, apiKey);

      if (!origami) {
        return NextResponse.json({
          error: `Couldn't understand the instructions for "${query}". Try a different search!`,
        }, { status: 404 });
      }

      // Cache the result
      try {
        await cacheOrigami(query, origami);
      } catch (cacheError) {
        console.error('Caching error:', cacheError);
        // Continue even if caching fails
      }

      return NextResponse.json({
        success: true,
        origami,
        cached: false,
      });
    } catch (aiError: any) {
      console.error('AI parsing error:', aiError);

      // Check for specific OpenAI errors
      if (aiError.message?.includes('API key')) {
        return NextResponse.json({
          error: 'Invalid OpenAI API key. Please check your API key in Settings!',
          needsApiKey: true,
        }, { status: 401 });
      }

      return NextResponse.json({
        error: 'AI processing failed. Please try again!',
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Search failed. Please try again!' },
      { status: 500 }
    );
  }
}
