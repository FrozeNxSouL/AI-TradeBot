// app/api/tiingo/route.ts
import { TiingoData } from '@/types/types';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    // Extract search params
    try {
        const body = await request.json();
        const { timeframe, currency } = body.data;
        if (!timeframe || !currency) {
            return NextResponse.json({ error: 'Please fill out all required fields' }, { status: 400 })
        }

        const endDate = new Date();

        // Calculate start date based on desired row count and timeframe
        const startDate = (() => {
            const start = new Date(endDate);
            switch (timeframe) {
                case 'D1':
                    start.setDate(endDate.getDate() - (1000));
                    break;
                case 'H1':
                    start.setHours(endDate.getHours() - (1000));
                    break;
                case 'M1':
                    start.setMinutes(endDate.getMinutes() - (1000));
                    break;
                default:
                    start.setDate(endDate.getDate() - (1000));
            }
            return start;
        })();

        let inputtf = "daily"
        if (timeframe == "H1") {
            inputtf = "1hour"
        } else if (timeframe == "M1") {
            inputtf = "1min"
        }
        // Construct query parameters
        const params = new URLSearchParams({
            token: process.env.TIINGO_API_KEY || '',
            startDate: startDate.toISOString().split('T')[0],
            format: 'json',
            resampleFreq: inputtf
        });
        console.log(`https://api.tiingo.com/tiingo/fx/${currency}/prices?${params}`)
        // console.log(process.env.)

        // Fetch data from Tiingo API
        const response = await fetch(`https://api.tiingo.com/tiingo/fx/${currency}/prices?${params}`, {
            headers: {
                'Authorization': `Token ${process.env.TIINGO_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        // const response = await fetch(`https://api.tiingo.com/tiingo/fx/${currency}/prices?${params}`);

        if (!response.ok) {
            throw new Error('Failed to fetch data from Tiingo');
        }

        const data = await response.json();
        const startIndex = Math.max(0, data.length - 1000);
        const sliced = data.slice(startIndex);

        // Transform data to match the expected format
        const transformedData: TiingoData[] = sliced.map((item: any) => ({
            time: new Date(item.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            price: item.close,
            date: `${new Date(item.date).getFullYear()}-${String(new Date(item.date).getMonth() + 1).padStart(2, '0')
                }-${String(new Date(item.date).getDate()).padStart(2, '0')
                }  ${new Date(item.date).toLocaleTimeString('en-US', { timeZoneName: 'short' }).split(' ')[2]
                }`
        }));

        // Return the data
        return NextResponse.json(transformedData);
    } catch (error) {
        console.error('Tiingo API Error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch data' },
            { status: 500 }
        );
    }
}