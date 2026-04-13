import { NextRequest, NextResponse } from 'next/server';

const COUNTRY_CODES: Record<string, string> = {
  india: 'IN',
  usa: 'US',
  greece: 'GR',
  japan: 'JP',
};

export async function GET(req: NextRequest) {
  const country = req.nextUrl.searchParams.get('country') || 'india';
  const code = COUNTRY_CODES[country] || 'IN';

  const url = `https://api.worldbank.org/v2/country/${code}/indicator/GC.DOD.TOTL.GD.ZS?format=json&per_page=40&mrv=40`;

  const res = await fetch(url);
  const json = await res.json();

  const raw = json[1] ?? [];
  const data = raw
    .filter((d: any) => d.value !== null)
    .map((d: any) => ({ year: d.date, debt: Math.round(d.value) }))
    .sort((a: any, b: any) => Number(a.year) - Number(b.year));

  return NextResponse.json(data);
}