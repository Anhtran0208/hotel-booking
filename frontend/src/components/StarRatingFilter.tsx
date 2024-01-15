type Props = {
    selectedStars: string[];
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void 
}

const StarRatingFilter = ({ selectedStars, onChange}: Props) => {
    return (
        <div className="border-b border-slate-300 pb-5">
            <h4 className="text-md font-semibold mb-2">Ratings</h4>
            {["5", "4", "3", "2", "1"].map((num) => (
                <label className="flex items-center space-x-2">
                    <input 
                    type="checkbox" 
                    className="rounded" 
                    value={num}
                    checked={selectedStars.includes(num)}
                    onChange={onChange} />

                    <span>{num} Stars</span>
                </label> 
            ))}
        </div>
    )
}
export default StarRatingFilter;