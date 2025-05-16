export default function Paging({
  page,
  totalPages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  onPageChange: (pageNumber: number) => void;
}) {
  const generatePageNumbers = (): (number | string)[] => {
    const pages: (number | string)[] = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);

      if (page > 3) pages.push("...");

      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (page < totalPages - 2) pages.push("...");

      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="pagination">
      {generatePageNumbers().map((p, idx) =>
        p === "..." ? (
          <span key={`ellipsis-${idx}`} className="page-ellipsis">
            ...
          </span>
        ) : (
          <button
            key={`page-${p}`}
            className={`page-btn ${p === page ? "active" : ""}`}
            onClick={() => onPageChange(p as number)}
          >
            {p}
          </button>
        )
      )}
    </div>
  );
}
