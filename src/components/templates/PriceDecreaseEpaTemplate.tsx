export const PriceDecreaseEpaTemplate = ({ data }: { data: any }) => (
  <div
    className="relative text-[14px] leading-[1.6] text-foreground px-12 py-10"
    style={{ fontFamily: "'Times New Roman', Times, serif" }}
  >
    {/* Logo */}
    <div className="absolute top-8 right-10">
      <img
        src={data.companyLogo}
        alt="Company Logo"
        className="h-[70px] w-auto object-contain"
      />
    </div>

    {/* Submission Date */}
    <p className="mb-6">{data.submissionDate}</p>

    {/* Address Block */}
    <p className="mb-6">
      Attn: {data.contractorName} ({data.contractNumber}) <br />
      General Services Administration <br />
      {data.gsaOfficeAddressLine} <br />
      {data.gsaOfficeCityStateZip}
    </p>

    {/* Re Line */}
    <div className="mb-6">
      <p>
        <strong>Re:</strong> <strong>{data.companyName}</strong>
        <br />
        <strong>
          Price Reduction Modification Based on a Commercial Price List to GSA
          Contract {data.contractNumber}
        </strong>
      </p>
    </div>

    {/* Greeting */}
    <p className="mb-4">
      Dear {data.salutation} {data.contractorName},
    </p>

    {/* Main Paragraph */}
    <p className="mb-4">
      The purpose of this letter is to request your approval of a price
      reduction modification based on a Commercial Price List to GSA Schedule
      Contract <strong>{data.contractNumber}</strong> under{" "}
      <strong>{data.totalSins}</strong> SIN(s) [<strong>{data.sin_price_decrease}</strong>]. This request is in accordance
      with EPA Clause GSAM 538.270-4(a)(3). The modification consists of a price
      decrease of{" "}
      <strong>{data.requestedDecrease || data.priceDecreasePercent}%</strong>{" "}
      for <strong>{data.priceDecreased}</strong> item(s) due to{" "}
      <strong>{data.decreaseRationale}</strong>.
    </p>

    {/* Bullet Points */}
    <ul className="list-disc ml-10 mb-4 space-y-2">
      <li>
        {data.companyName} acknowledges that this proposed price decrease will
        go into effect immediately, as of the date of submission.
      </li>

      <li>All prices offered to GSA include the current IFF.</li>

      <li>
        {data.cspStatement ||
          "For non-TDR contracts only: Commercial Sales Practices (CSP) information previously submitted in accordance with GSAR 552.238-81 Price Reductions remains accurate and unchanged. If CSP information has changed, an updated CSP-1 has been provided within eMod."}
      </li>
    </ul>

    {/* Certification */}
    <p className="mb-4">
      I certify to the best of my knowledge that the information I provided is
      current, complete, and accurate. All other terms and conditions remain the
      same.
    </p>

    {/* Contact */}
    <p className="mb-4">
      If you have any questions regarding this request, please contact{" "}
      <strong>{data.consultantName}</strong> at The Winvale Group at{" "}
      <strong>{data.consultantPhone}</strong> or{" "}
      <strong>{data.consultantEmail}</strong>.
    </p>

    {/* Signature */}
    <p className="mb-4">Respectfully ,</p>
    <div>
      <p>
        _________________________________
        <br />
        {data.negotiatorName || "AUTHORIZED NEGOTIATOR NAME"}
        <br />
        {data.negotiatorTitle || "[Title]"} – Authorized to sign on behalf of{" "}
        {data.companyName || "COMPANY NAME"}
      </p>
    </div>
  </div>
);
