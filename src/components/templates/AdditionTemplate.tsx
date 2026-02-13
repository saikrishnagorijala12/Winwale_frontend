export const AdditionTemplate = ({ data }: { data: any }) => (
  <div
    className="relative text-[14px] leading-[1.6] text-foreground px-12 py-10"
    style={{ fontFamily: "'Times New Roman', Times, serif" }}
  >
    <div className="absolute top-6 right-8">
      <img src="logo.png" alt="Winvale" className="h-10 w-10" />
    </div>

    <p className="mb-6">{data.submissionDate}</p>

    <p className="mb-6">
      Attn: {data.contractorName} ({data.contractNumber}) <br />
      General Services Administration <br />
      {data.gsaOfficeAddressLine} <br />
      {data.gsaOfficeCityStateZip}
    </p>

    <div className="mb-6">
      <p>
        <strong>Re:</strong> <strong>{data.companyName}</strong>
        <br />
        <strong>
          Add Product Modification to GSA Contract{" "}
          <strong>{data.contractNumber}</strong>
        </strong>
      </p>
    </div>

    <p className="mb-4">
      Dear {data.salutation} {data.contractorName}
    </p>

    <p className="mb-4">
      The purpose of this letter is to request your approval of an Add Product
      Modification to GSA Schedule Contract{" "}
      <strong>{data.contractNumber}</strong>.{" "}
      <strong>{data.numberOfProductsAdded}</strong> products under SIN(s){" "}
      <strong>{data.sin_additions}</strong>. We would like to add these products because{" "}
      <strong>{data.additionRationale}</strong>.
    </p>

    <ul className="list-disc ml-6 mb-4 space-y-1">
      <li>
        We certify that these products are TAA Compliant in accordance with
        52.225-6 TRADE AGREEMENTS CERTIFICATE (MAY 2014). The Country of Origin for the added products is{" "}
        <strong>
          {data?.coo && data.coo.trim() !== "" && data.coo !== "undefined"
            ? data.coo
            : "—"}
        </strong>
        .
      </li>
      <li>
        GSA Basic Discount: <strong>{data.basicDiscount}</strong> %
      </li>
      <li>
        Number of products added:{" "}
        <strong>{data.numberOfProductsAdded || "0"}</strong>
      </li>
      <li>
        Quantity / Volume Discount:{" "}
        <strong>{data.quantityVolumeDiscount || "None"}</strong>
      </li>
      <li>
        Other Discounts / Concessions:{" "}
        <strong>{data.otherDiscounts || "—"}</strong>
      </li>
      <li>
        Delivery After Receipt of Order (ARO):
        <ul className="list-disc ml-6">
          <li>
            Normal: <strong>{data.deliveryAroNormal}</strong>
          </li>
          <li>
            Expedited: <strong>{data.deliveryAroExpedited}</strong>
          </li>
        </ul>
      </li>
      <li>
        FOB Terms: <strong>{data.fobTerms}</strong>
      </li>
      <li>There have been (no) changes to our Commercial Sales Practices.</li>
      <li>
        Energy Star Compliance:{" "}
        {data.energyStarCompliance === "yes" ? (
          <strong>Yes</strong>
        ) : data.energyStarCompliance === "no" ? (
          <strong>No</strong>
        ) : data.energyStarCompliance === "na" ? (
          <strong>Not Applicable</strong>
        ) : (
          "—"
        )}
      </li>
      <li>
        This modification is submitted under Solicitation
        <strong>{` ${data.solicitationNumber}`}</strong> Refresh{" "}
        <strong>{data.refresh}</strong>.
      </li>
      <li>
        The items being added are not identical/substantially similar to
        previously deleted items that had a lower Schedule price.
      </li>
      <li>No hazardous materials will be delivered under this contract.</li>
      <li>Place of Performance per FAR 52.215-6 (see current Solicitation).</li>
      <li>
        If applicable, EPA method and mechanism are unchanged or proposed
        herein.
      </li>
    </ul>

    <p className="mb-4">
      I certify to the best of my knowledge that the information I provided is
      current, complete and accurate. All other terms and conditions remain the
      same.
    </p>

    <p className="mb-4">
      If you have any questions regarding this request, please contact{" "}
      <strong>{data.consultantName}</strong> at The Winvale Group at{" "}
      <strong>{data.consultantPhone}</strong> or{" "}
      <strong>{data.consultantEmail}</strong>.
    </p>

    <p className="mb-4">Sincerely,</p>
    <div>
      <p>
        _________________________________
        <br />
        {data.contractorName || "AUTHORIZED NEGOTIATOR NAME"}
        <br />
        {data.authorizedNegotiatorTitle || "[Title]"} – Authorized to sign on
        behalf of {data.companyName || "COMPANY NAME"}
      </p>
    </div>
  </div>
);
