import RestaurantItem from "@/components/screens/home/restaurant-item"
import restaurantService from "@/services/restaurant/restaurant.service"
import Image from "next/image"
import { notFound } from "next/navigation"

export const revalidate = 0

const Home = async () => {
  const data = await restaurantService.getAll({})

  if (!data) notFound()

  console.log("data", data)
  console.log("Page 1 app/[locale]")

  return (
    <div className="no-scrollbar h-screen overflow-y-auto">
      <header className="sticky top-0 flex h-[62px] items-center justify-center bg-gray-900">
        <Image src="/icons/logo_light.png" alt="logo" width={79} height={24} />
      </header>
      <div className="container z-0 px-4">
        <div className="flex flex-col gap-2 py-4">
          {data?.data.restaurants.map((restaurant, index) => (
            <RestaurantItem key={index} item={restaurant} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Home
