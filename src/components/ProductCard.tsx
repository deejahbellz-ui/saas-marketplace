type ProductCardProps = {
  name: string;
  price: string;
};

export default function ProductCard({ name, price }: ProductCardProps) {
  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <h2 className="font-semibold">{name}</h2>
      <p className="text-gray-600">{price}</p>
    </div>
  );
}