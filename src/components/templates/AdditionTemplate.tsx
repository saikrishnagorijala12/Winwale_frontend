export const AdditionTemplate = ({ data }: { data: any }) => (
  <div className="relative text-[13px] leading-[1.6] text-foreground px-8 py-6">
    <div className="absolute top-6 right-8">
      <img
        src="winvale-logo.png"
        alt="Winvale"
        className="h-10 w-[140px] object-contain"
      />
    </div>

    <p className="mb-4">[{data.submissionDate}]</p>

    <div className="mb-4">
      Attn: Jane M. Doe (CO-12345) <p>General Services Administration</p>
      <p>{data.gsaOfficeAddressLine}</p>
      <p>{data.gsaOfficeCityStateZip}</p>
    </div>

    <div className="mb-4">
      <p>
        <strong>Re:</strong> {data.companyName}
        <br />
        <strong>
          Add Product Modification to GSA Contract {data.contractNumber}
        </strong>
      </p>
    </div>

    <p className="mb-3">Dear Mr. John A. Smith</p>

    <p className="mb-3">
      The purpose of this letter is to request your approval of an Add Product
      Modification to GSA Schedule Contract {data.contractNumber}.{" "}
      {data.companyName}
      requests to add {data.numberOfProductsAdded} products under SIN(s){" "}
      {data.sin}. These products are being added because{" "}
      {data.additionRationale}.
    </p>

    <ul className="list-disc ml-6 mb-4 space-y-1">
      <li>
        We certify that these products are TAA Compliant in accordance with
        52.225-6 Trade Agreements Certificate (May 2014). Country of Origin:
        {` ${data.coo}`}.
      </li>
      <li>GSA Basic Discount: 15 %</li>
      <li>Number of products added: _____</li>
      <li>
        Quantity / Volume Discount:{" "}
        {data.quantityVolumeDiscount || "CO Last Name"}
      </li>
      <li>
        Other Discounts / Concessions: {data.otherDiscounts || "CO Last Name"}
      </li>
      <li>
        Delivery After Receipt of Order (ARO):
        <ul className="list-disc ml-6">
          <li>Normal: {data.deliveryAroNormal}</li>
          <li>Expedited: {data.deliveryAroExpedited}</li>
        </ul>
      </li>
      <li>FOB Terms: {data.fobTerms}</li>
      <li>
        There have been (no) changes to our Commercial Sales Practices.
        <br />
      </li>
      <li>
        Energy Star Compliance:{" "}
        {data.energyStarCompliance === "yes"
          ? "Yes"
          : data.energyStarCompliance === "no"
          ? "No"
          : data.energyStarCompliance === "na"
          ? "Not Applicable"
          : "—"}
      </li>
      <li>
        This modification is submitted under Solicitation
        {` ${data.solicitationNumber}`} Refresh {data.refresh_number}.
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
      {data.consultantName} at The Winvale Group at {data.consultantPhone} or{" "}
      {data.consultantEmail}.
    </p>

    <p className="mb-6">Sincerely,</p>
    <div>
      <p className="font-semibold">
        {data.authorizedNegotiatorName || "John R. Doe"}
      </p>
      <p>
        {data.authorizedNegotiatorTitle || "Director of Contracts"} – Authorized
        to sign on behalf of {data.companyName || "COMPANY NAME"}
      </p>
    </div>
  </div>
);
