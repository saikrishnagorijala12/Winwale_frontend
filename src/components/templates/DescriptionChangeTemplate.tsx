export const ProductDescriptiveChangeTemplate = ({ data }: { data: any }) => (
  <div className="relative text-[13px] leading-[1.6] text-foreground px-8 py-6">
    <div className="absolute top-8 right-10">
      <img
        src={data.companyLogo}
        alt="Company Logo"
        className="h-[70px] w-auto object-contain"
      />
    </div>

    <p className="mb-4">{data.submissionDate}</p>

    <p className="mb-4">
      Attn: {data.contractorName} ({data.contractNumber}) <br />
      General Services Administration <br />
      {data.gsaOfficeAddressLine} <br />
      {data.gsaOfficeCityStateZip}
    </p>
    <div className="mb-4">
      <p>
        <strong>Re:</strong> <strong>{data.companyName}</strong>
        <br />
        <strong>
          Product Descriptive Change Modification to GSA Contract{" "}
          <strong>{data.contractNumber}</strong>
        </strong>
      </p>
    </div>

    <p className="mb-3">
      Dear {data.salutation} {data.contractorName}
    </p>

    <p className="mb-4">
      The purpose of this letter is to request your approval of a product
      descriptive modification to GSA Schedule Contract{" "}
      <strong>{data.contractNumber}</strong> under{" "}
      <strong>{data.totalSins}</strong> SIN(s) [<strong>{data.sin_description_change}</strong>]. The modification consists
      of descriptive changes for <strong>{data.descriptionChanged}</strong>{" "}
      item(s) due to <strong>{data.modificationRationale}</strong>. These
      revisions will not result in any changes to the GSA price.
    </p>

    <p className="mb-4">
      I certify to the best of my knowledge that the information I provided is
      current, complete and accurate. All other terms and conditions remain the
      same.
    </p>
    <p className="mb-4">
      If you have any questions regarding this request, please contact{" "}
      <strong>{data.consultantName}</strong> at{" "}
      <strong>{data.consultantPhone}</strong> or{" "}
      <strong>{data.consultantEmail}</strong>.
    </p>

    <p className="mb-4">Respectfully,</p>
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
