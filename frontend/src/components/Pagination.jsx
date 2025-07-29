import React from 'react';

export default function Pagination({currentPage, totalPages, onPageChange}) {
    return(
        <div className='flex justify-between items-center mt-6'>
            <button 
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className='px-4 py-2 bg-gray-500 text-white rounded disabled:opacity-50'
            >
                Previous
            </button>

            <p>Page {currentPage} of {totalPages} </p>

            <button 
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className='px-4 py-2 bg-gray-500 text-white rounded disabled:opacity-50'
            >
                Next
            </button>
        </div>
    )
}