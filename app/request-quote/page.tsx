import { RequestQuotePage } from "@/components/rfq/RequestQuotePage";

export const metadata = {
  title: "Request a Quote | FERASA",
  description:
    "Send FERASA an industrial RFQ with manufacturer, part number, quantities, delivery requirements and supporting documents.",
};

type RequestQuotePageProps = {
  searchParams: Promise<{
    manufacturer?: string;
    partNumber?: string;
    description?: string;
  }>;
};

export default async function Page({
  searchParams,
}: RequestQuotePageProps) {
  const params = await searchParams;

  return (
    <RequestQuotePage
      initialItem={{
        manufacturer: params.manufacturer || "",
        partNumber: params.partNumber || "",
        description: params.description || "",
      }}
    />
  );
}