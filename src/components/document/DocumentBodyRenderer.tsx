import { resolveTemplateType } from "@/src/types/document.types";
import { AdditionTemplate } from "../templates/AdditionTemplate";
import { DeletionTemplate } from "../templates/DeletionTemplate";
import { ProductDescriptiveChangeTemplate } from "../templates/DescriptionChangeTemplate";
import { PriceIncreaseEpaTemplate } from "../templates/PriceIncreaseEpaTemplate";
import { PriceDecreaseEpaTemplate } from "../templates/PriceDecreaseEpaTemplate";

export const DocumentBodyRenderer = ({
  documentId,
  data,
}: {
  documentId: string;
  data: any;
}) => {
  const type = resolveTemplateType(documentId);

  return (
    <div id="document-export-root" className="bg-white text-black w-full">
      {(() => {
        switch (type) {
          case "addition":
            return <AdditionTemplate data={data} />;
          case "deletion":
            return <DeletionTemplate data={data} />;

          case "description-change":
            return <ProductDescriptiveChangeTemplate data={data} />;

          case "price-increase":
            return <PriceIncreaseEpaTemplate data={data} />

          case "price-decrease":
            return <PriceDecreaseEpaTemplate data={data} />

          default:
            return null;
        }
      })()}
    </div>
  );
};
