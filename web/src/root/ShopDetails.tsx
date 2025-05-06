import { useParams } from 'react-router-dom';

export default function ShopDetails() {
  const { slug } = useParams();
  return <div>Shop details for: {slug}</div>;
}
