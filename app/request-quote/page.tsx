import { RequestQuotePage } from "@/components/rfq/RequestQuotePage";

export const metadata = {
  title: "Request a Quote | FERASA",
  description: "Send FERASA an industrial RFQ with manufacturer, part number, quantities, delivery requirements and supporting documents.",
};

export default function Page() {
  return <RequestQuotePage />;
}
