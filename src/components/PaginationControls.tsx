import React from 'react';
import { Button } from '@nextui-org/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationControlsProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    isLoading?: boolean;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({
    currentPage,
    totalPages,
    onPageChange,
    isLoading = false,
}) => {
    if (totalPages <= 1) return null;

    return (
        <div className="flex justify-center items-center gap-2 mt-8 animate-in fade-in slide-in-from-bottom-4">
            <Button
                isIconOnly
                variant="flat"
                isDisabled={currentPage === 0 || isLoading}
                onClick={() => onPageChange(currentPage - 1)}
                className="bg-default-100 hover:bg-default-200"
            >
                <ChevronLeft size={20} />
            </Button>

            <span className="text-sm font-mono text-muted-foreground mx-2">
                Page <span className="text-foreground font-bold">{currentPage + 1}</span> of <span className="text-foreground font-bold">{totalPages}</span>
            </span>

            <Button
                isIconOnly
                variant="flat"
                isDisabled={currentPage >= totalPages - 1 || isLoading}
                onClick={() => onPageChange(currentPage + 1)}
                className="bg-default-100 hover:bg-default-200"
            >
                <ChevronRight size={20} />
            </Button>
        </div>
    );
};

export default PaginationControls;
