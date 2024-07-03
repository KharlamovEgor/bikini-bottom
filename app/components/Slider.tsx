import { Link } from '@remix-run/react';

export function Slider(): JSX.Element {
  return (
    <div className="container">
      <div className="first-slide">
        {
          // <div className="first-slide__heading">
          //   <h1>CloClips</h1>
          //   <h1>SHOP</h1>
          // </div>
          // <p>Best Spongebob's Products for you</p>
        }
        <div className="first-slide__link">
          <Link to="/collections/all"></Link>
        </div>
      </div>
    </div>
  );
}
