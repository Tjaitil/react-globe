interface CardProps {
  content: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export const Card = ({ content, onClick, className }: CardProps) => {
  return (
    <div className={`card-primary ${className || ''}`} onClick={onClick}>
      {content}
    </div>
  );
};
