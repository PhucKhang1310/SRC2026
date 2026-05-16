import { usePagination } from '../../hook/usePagination';

const DOTS = '...';

type PaginationProps = {
    onPageChange: (page: number) => void;
    totalCount: number;
    siblingCount?: number;
    currentPage: number;
    pageSize: number;
    className?: string;
};

const Pagination = ({
    onPageChange,
    totalCount,
    siblingCount = 1,
    currentPage,
    pageSize,
    className,
}: PaginationProps) => {
    const paginationRange = usePagination({
        currentPage,
        totalCount,
        siblingCount,
        pageSize,

    });

    if (currentPage === 0 || (paginationRange && paginationRange?.length < 2)) {
        return null;
    }

    const onNext = () => {
        onPageChange(currentPage + 1);
    };

    const onPrevious = () => {
        onPageChange(currentPage - 1);
    };

    const lastPage = paginationRange?.[paginationRange?.length - 1];
    const isPrevDisabled = currentPage === 1;
    const isNextDisabled = currentPage === lastPage;

    const baseItem =
        'inline-flex h-10 min-w-10 items-center justify-center rounded-md border border-amber-50/20 bg-zinc-800 px-3 text-sm font-medium text-amber-50 transition-colors';
    const hoverItem = 'hover:bg-zinc-700';
    const selectedItem = 'bg-[#f27255] text-white border-transparent';
    const disabledItem = 'opacity-40 pointer-events-none';

    return (
        <ul
            className={`flex items-center justify-center gap-2 ${className ?? ''}`}
            aria-label="Pagination"
        >
            <li>
                <button
                    type="button"
                    onClick={onPrevious}
                    disabled={isPrevDisabled}
                    className={`${baseItem} ${hoverItem} ${isPrevDisabled ? disabledItem : ''
                        }`}
                    aria-label="Previous page"
                >
                    <span aria-hidden>‹</span>
                </button>
            </li>

            {paginationRange?.map((pageNumber, idx) => {
                if (pageNumber === DOTS) {
                    return (
                        <li
                            key={`dots-${idx}`}
                            className="inline-flex h-10 min-w-10 items-center justify-center px-2 text-amber-50/60"
                            aria-hidden
                        >
                            …
                        </li>
                    );
                }

                const page = pageNumber as number;
                const isSelected = page === currentPage;

                return (
                    <li key={page}>
                        <button
                            type="button"
                            onClick={() => onPageChange(page)}
                            className={`${baseItem} ${hoverItem} ${isSelected ? selectedItem : ''
                                }`}
                            aria-current={isSelected ? 'page' : undefined}
                        >
                            {page}
                        </button>
                    </li>
                );
            })}

            <li>
                <button
                    type="button"
                    onClick={onNext}
                    disabled={isNextDisabled}
                    className={`${baseItem} ${hoverItem} ${isNextDisabled ? disabledItem : ''
                        }`}
                    aria-label="Next page"
                >
                    <span aria-hidden>›</span>
                </button>
            </li>
        </ul>
    );
};

export default Pagination;