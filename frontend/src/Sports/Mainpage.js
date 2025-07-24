import { useState } from "react";
import './Sports.css'
import { Link } from 'react-router-dom';

function Sports() {
  const data = [
    {
      id: 1,
      image: 'https://images.pexels.com/photos/296278/pexels-photo-296278.jpeg?auto=compress&cs=tinysrgb&w=600',
      title: "Boating",
      subTitle: "Boating is the leisurely activity of travelling by boat, or the recreational use.",
      hasMap: true
    },
    {
      id: 2,
      image: 'https://images.pexels.com/photos/22028339/pexels-photo-22028339/free-photo-of-backpacker-exploring-a-cave.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      title: "Caving",
      subTitle: "Caving, also known as spelunking (United States and Canada) and potholing (UK).",
      hasMap: true
    },
    {
      id: 3,
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrh-x8H9MmLE8N-6QeYltXzsdig0LEt5IGpg&s',
      title: "Dune Bashing",
      subTitle: "Dune Bashing is a leading Dubai-based tour company.",
      hasMap: true
    },
    {
      id: 4,
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSGV2mWKiWMeN4N6Ws-1xtqaq3mpsM9a82Hzg&s',
      title: "Hang Gliding",
      subTitle: "Hand gliding is an air sport or recreational activity in which a pilot flies a light, non-motorised.",
      hasMap: true
    },
    {
      id: 5,
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSFQcCA2P42dMxedKQ4oilV4UOWA38oyC9R-Q&s',
      title: "Kite Landboarding",
      subTitle: "Kite landboarding involves the use of a mountain board or landboard.",
      hasMap: true
    },
    {
      id: 6,
      image: 'https://images.pexels.com/photos/2158963/pexels-photo-2158963.jpeg?auto=compress&cs=tinysrgb&w=600',
      title: "Mountain Biking",
      subTitle: "Mountain biking (abbr. MTB) is a sport of riding bicycles off-road, often over rough.",
      hasMap: true
    },
    {
      id: 7,
      image: 'https://images.pexels.com/photos/1365425/pexels-photo-1365425.jpeg?auto=compress&cs=tinysrgb&w=600',
      title: "Mountain Climbing",
      subTitle: "Mountain climbing is the sport of reaching, or trying to reach, high points.",
      hasMap: true
    },
    {
      id: 8,
      image: 'https://images.pexels.com/photos/25684769/pexels-photo-25684769/free-photo-of-people-parasailing-over-water-with-boat.jpeg?auto=compress&cs=tinysrgb&w=600',
      title: "Parachute Diving",
      subTitle: "Parachuting and skydiving is a method of transiting from a high point.",
      hasMap: true
    },
    {
      id: 9,
      image: 'https://images.pexels.com/photos/2405643/pexels-photo-2405643.jpeg?auto=compress&cs=tinysrgb&w=600',
      title: "Scuba Diving",
      subTitle: "Scuba diving is a mode of underwater diving whereby divers use breathing equipment.",
      hasMap: true
    },
    {
      id: 10,
      image: 'https://images.pexels.com/photos/2433353/pexels-photo-2433353.jpeg?auto=compress&cs=tinysrgb&w=600',
      title: "Skiing",
      subTitle: "Skiing is recreation, sport, and a mode of transportation.",
      hasMap: true
    },
    {
      id: 11,
      image: 'https://images.pexels.com/photos/11124985/pexels-photo-11124985.jpeg?auto=compress&cs=tinysrgb&w=600',
      title: "Sky Diving",
      subTitle: "Skydiving involves the use of a parachute for either recreational or competitive purposes.",
      hasMap: true
    },
    {
      id: 12,
      image: 'https://images.pexels.com/photos/416676/pexels-photo-416676.jpeg?auto=compress&cs=tinysrgb&w=600',
      title: "Surfing",
      subTitle: "Surfing is a surface water sport in which an individual, a surfer uses a board to ride.",
      hasMap: true
    },
    {
      id: 13,
      image: 'https://images.pexels.com/photos/1365425/pexels-photo-1365425.jpeg?auto=compress&cs=tinysrgb&w=600',
      title: "Trekking",
      subTitle: "Trekking is a recreational activity that involves covering any specified journey on foot.",
      hasMap: true
    },
    {
      id: 14,
      image: 'https://images.pexels.com/photos/2828471/pexels-photo-2828471.jpeg?auto=compress&cs=tinysrgb&w=600',
      title: "Water Rafting",
      subTitle: "Water rafting involves navigating rivers or other bodies of water using a raft.",
      hasMap: true
    },
    {
      id: 15,
      image: 'https://images.pexels.com/photos/6156358/pexels-photo-6156358.jpeg?auto=compress&cs=tinysrgb&w=600',
      title: "Zip Line",
      subTitle: "A zip-line, zip line, zip-wire, flying fox, or death slide is a pulley suspended on a cable.",
      hasMap: true
    },
  ];

  return (
    <>
      <div className="title">
        <h1 className="heading">Life is either a daring adventure or Nothing at all</h1>
      </div>
      <div className="sport-activity">
        {data.map((sport, index) => (
          <div className="activities" key={index}>
            <Link to={`/sport/${sport.id}`}>
              <img src={sport.image} alt={sport.title} />
            </Link>
            <h2>{sport.title}</h2>
            <p>{sport.subTitle}</p>
            
            <Link to={`/sports/${sport.title.toLowerCase()}`} className="view-map-btn">
              View Best Locations on Map
            </Link>
          </div>
        ))}
      </div>
      
      <div className="map-feature-section">
        <h2>Discover Top Adventure Destinations</h2>
        <p>Explore the best locations for adventure sports across India with our interactive maps.</p>
        <div className="map-feature-cards">
          {data.slice(0, 6).map((sport, index) => (
            <div className="map-feature-card" key={index}>
              <img src={sport.image} alt={sport.title} />
              <div className="map-feature-info">
                <h3>{sport.title} Hotspots</h3>
                <p>Find the best {sport.title.toLowerCase()} destinations in India</p>
                <Link to={`/sports/${sport.title.toLowerCase()}`} className="explore-map-btn">
                  Explore on Map
                </Link>
              </div>
            </div>
          ))}
        </div>
        
        <div className="view-all-maps-container">
          <Link to="/sports-maps" className="view-all-maps-btn">
            View All Sports Maps
          </Link>
        </div>
      </div>
    </>
  );
}

export default Sports;