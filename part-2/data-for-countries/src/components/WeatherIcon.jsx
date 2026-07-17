import {
  Sun,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudLightning,
  CloudFog,
  Wind,
} from "lucide-react";

const WeatherIcon = ({ weatherData }) => {
  switch (weatherData.weather[0].main) {
    case "Clear":
      return <Sun size={100} color="orange" />;

    case "Clouds":
      return <Cloud size={100} color="gray" />;

    case "Rain":
      return <CloudRain size={100} color="blue" />;

    case "Snow":
      return <CloudSnow size={100} color="white" />;

    case "Thunderstorm":
      return <CloudLightning size={100} color="purple" />;

    case "Mist":
    case "Fog":
    case "Haze":
      return <CloudFog size={100} color="gray" />;

    default:
      return <Cloud size={100} color="gray" />;
  }
};

export default WeatherIcon;
