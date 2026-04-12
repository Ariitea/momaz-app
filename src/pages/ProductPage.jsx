import { useParams } from "react-router-dom";
import productsData from "../data/products.json";
import { Link } from "react-router-dom";

function ProductPage() {
    const { id } = useParams();

    const product = productsData.products.find(
        (p) => p.id === id
    );

        if (!product) {
            return <p>Product not found</p>;
        }
    
        return (
            <Link to={`/product/${product.id}`}>
                <article className="product-card">
                    <div>
                        <img
                            src={product.images?.[0]}
                            alt={product.title}
                            style={{ width: "400px" }}
                        />
    
                        <h1>{product.title}</h1>
                        <p>{product.category}</p>
    
                        <a href={product.product_url} target="_blank">
                            View original product
                        </a>
                    </div>
                </article>
            </Link>
        );
    }
    
    export default ProductPage;