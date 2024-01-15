export type Props = {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const Pagination = ({ page, totalPages, onPageChange}: Props) => {
    const pageNumbers = []

    for (let i = 1; i <= totalPages; i++){
        pageNumbers.push(i);
    }
    return (
        <div className="flex justify-center">
            <ul className="flex border border-slate-300">
                {pageNumbers.map((num) => (
                    <li className={`px-2 py-1 ${page === num ? "bg-gray-200": ""}`}>
                        <button onClick={() => onPageChange(num)}>{num}</button>
                    </li>
                ))}
            </ul>
        </div>
    )
}
export default Pagination;