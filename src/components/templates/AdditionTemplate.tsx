export const AdditionTemplate = ({ data }: { data: any }) => (
  <div className="relative text-[13px] leading-[1.6] text-foreground px-8 py-6">
    <div className="absolute top-6 right-8">
      <img
        src="winvale-logo.png"
        alt="Winvale"
        className="h-10 w-[140px] object-contain"
      />
    </div>

    <p className="mb-4"><strong>[{data.submissionDate}]</strong></p>

    <div className="mb-4">
      Attn: <strong>{data.contractorName}</strong> (<strong>{data.contractNumber}</strong>) <p>General Services Administration</p>
      <p><strong>{data.gsaOfficeAddressLine}</strong></p>
      <p><strong>{data.gsaOfficeCityStateZip}</strong></p>
    </div>

    <div className="mb-4">
      <p>
        <strong>Re:</strong> <strong>{data.companyName}</strong>
        <br />
        <strong>
          Add Product Modification to GSA Contract <strong>{data.contractNumber}</strong>
        </strong>
      </p>
    </div>

    <p className="mb-3">
      Dear <strong>{data.salutation}</strong> <strong>{data.contractorName}</strong>
    </p>

    <p className="mb-3">
      The purpose of this letter is to request your approval of an Add Product
      Modification to GSA Schedule Contract <strong>{data.contractNumber}</strong>.{" "}
      <strong>{data.companyName}</strong>
      requests to add <strong>{data.numberOfProductsAdded}</strong> products under SIN(s){" "}
      <strong>{data.sin}</strong>. These products are being added because{" "}
      <strong>{data.additionRationale}</strong>.
    </p>

    <ul className="list-disc ml-6 mb-4 space-y-1">
      <li>
        We certify that these products are TAA Compliant in accordance with
        52.225-6 Trade Agreements Certificate (May 2014). Country of Origin:
        <strong>{` ${data.coo}`}</strong>.
      </li>
      <li>GSA Basic Discount: <strong>{data.basicDiscount}</strong> %</li>
      <li>Number of products added: <strong>{data.numberOfProductsAdded || '0'}</strong></li>
      <li>
        Quantity / Volume Discount:{" "}
        <strong>{data.quantityVolumeDiscount || "None"}</strong>
      </li>
      <li>
        Other Discounts / Concessions: <strong>{data.otherDiscounts || "—"}</strong>
      </li>
      <li>
        Delivery After Receipt of Order (ARO):
        <ul className="list-disc ml-6">
          <li>Normal: <strong>{data.deliveryAroNormal}</strong></li>
          <li>Expedited: <strong>{data.deliveryAroExpedited}</strong></li>
        </ul>
      </li>
      <li>FOB Terms: <strong>{data.fobTerms}</strong></li>
      <li>
        There have been (no) changes to our Commercial Sales Practices.
        <br />
      </li>
      <li>
        Energy Star Compliance:{" "}
        {data.energyStarCompliance === "yes"
          ? <strong>Yes</strong>
          : data.energyStarCompliance === "no"
            ? <strong>No</strong>
            : data.energyStarCompliance === "na"
              ? <strong>Not Applicable</strong>
              : "—"}
      </li>
      <li>
        This modification is submitted under Solicitation
        <strong>{` ${data.solicitationNumber}`}</strong> Refresh <strong>{data.refresh}</strong>.
      </li>
      <li>
        Items added are not identical or substantially similar to previously
        deleted items with lower Schedule pricing.
      </li>
      <li>No hazardous materials will be delivered under this contract.</li>
      <li>Place of Performance per FAR 52.215-6 (see current Solicitation).</li>
      <li>
        If applicable, EPA method and mechanism are unchanged or proposed
        herein.
      </li>
    </ul>

    <p className="mb-4">
      I certify that the information provided is current, complete, and
      accurate. All other terms and conditions of the contract remain unchanged.
    </p>

    <p className="mb-4">
      If you have any questions regarding this request, please contact{" "}
      <strong>{data.consultantName}</strong> at The Winvale Group at <strong>{data.consultantPhone}</strong> or{" "}
      <strong>{data.consultantEmail}</strong>.
    </p>

    <p className="mb-6">Sincerely,</p>
    <div>
      <p className="font-semibold">
        <strong>{data.authorizedNegotiatorName || "John R. Doe"}</strong>
      </p>
      <p>
        <strong>{data.authorizedNegotiatorTitle || "Director of Contracts"}</strong> – Authorized
        to sign on behalf of <strong>{data.companyName || "COMPANY NAME"}</strong>
      </p>
    </div>
  </div>
);
