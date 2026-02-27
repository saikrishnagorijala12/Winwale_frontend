export const DeletionTemplate = ({ data }: { data: any }) => {
  console.log("DeletionTemplate data:", data);
  console.log("companyLogo value:", data?.companyLogo);

  return (
    <div
      className="relative text-[14px] leading-[1.6] text-foreground px-12 py-10"
      style={{ fontFamily: "'Times New Roman', Times, serif" }}
    >
      {/* Logo */}
      <div className="absolute top-8 right-10">
        <img
          src={data?.companyLogo}
          alt="Company Logo"
          className="h-[70px] w-auto object-contain"
        />
      </div>

      {/* Date */}
      <p className="mb-6">{data?.submissionDate || "DATE"}</p>

      {/* Address Block */}
      <p className="mb-6">
        Attn: {data?.contractorName} ({data?.contractNumber}) <br />
        General Services Administration <br />
        {data?.gsaOfficeAddressLine} <br />
        {data?.gsaOfficeCityStateZip}
      </p>

      {/* Subject */}
      <div className="mb-6">
        <p>
          <strong>Re:</strong> <strong>{data?.companyName}</strong>
          <br />
          <strong>
            Deletion Modification to GSA Contract{" "}
            {data?.contractNumber}
          </strong>
        </p>
      </div>

      <p className="mb-4">
        Dear {data?.salutation} {data?.contractorName}
      </p>

      {/* Body */}
      <p className="mb-4">
        The purpose of this letter is to request your approval of a Deletion
        Modification to GSA Schedule Contract{" "}
        <strong>{data?.contractNumber}</strong>. The modification consists of the
        deletion of <strong>{data?.numberOfProductsDeleted}</strong> item(s)
        listed under <strong>{data?.totalSins}</strong> SIN(s) [<strong>{data?.sin_deletions}</strong>]. These products
        are being removed because <strong>{data?.deletionRationale}</strong>.
      </p>

      <p className="mb-0">{data?.companyName} states the following:</p>

      <ol
        className="ml-10 space-y-1 list-outside"
        style={{ listStyleType: "lower-alpha" }}
      >
        <li>
          The items being deleted will not be added at a later date with a
          higher price without justification for such higher price.
        </li>
      </ol>

      <p className="mb-4">
        I certify to the best of my knowledge that the information I provided is
        current, complete and accurate. All other terms and conditions remain the
        same.
      </p>

      {/* Contact */}
      <p className="mb-4">
        If you have any questions regarding this request, please contact{" "}
        <strong>{data?.consultantName}</strong> of The Winvale Group at{" "}
        <strong>{data?.consultantPhone}</strong> or{" "}
        <strong>{data?.consultantEmail}</strong>.
      </p>

      {/* Signature */}
      <p className="mb-4">Sincerely,</p>

      <div>
        <p>
          _________________________________
          <br />
          {data?.negotiatorName || "AUTHORIZED NEGOTIATOR NAME"}
          <br />
          {data?.negotiatorTitle || "[Title]"} – Authorized to sign on behalf of{" "}
          {data?.companyName || "COMPANY NAME"}
        </p>
      </div>
    </div>
  );
};