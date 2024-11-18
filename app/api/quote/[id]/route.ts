import {
  createAndGetQuote,
  getQuoteById,
  updateQuoteById,
} from "@/lib/utils/query";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  if (params.id != "create") {
    const id = parseInt(params.id);

    const data = await getQuoteById(id, { ttl: 60 });

    return new Response(JSON.stringify(data.data), {
      headers: { "Content-Type": "application/json" },
    });
  }

  const data = await createAndGetQuote({ ttl: 60 });

  return new Response(JSON.stringify(data.data), {
    headers: { "Content-Type": "application/json" },
  });
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id);
  const { quote } = await request.json();
  const data = await updateQuoteById(id, quote);
  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });
}
