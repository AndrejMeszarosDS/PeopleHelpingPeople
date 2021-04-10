# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)
#User.create!(first_name: "Joey", last_name: "Ramone", email: "joey@ramones.com", password: "ramones", password_confirmation: "ramones")
#User.create!(first_name: "Johnny", last_name: "Meszi", email: "johnny@ramones.com", password: "ramones", password_confirmation: "ramones")


# Request seed with faker : NewYork LatLng : 42,-76

center_point = { lat: 42, lng: -76 }

1.upto(20) do |i|
  Request.create!(
    rtype: rand(1..12).to_i,
    description: Faker::Lorem.paragraph,
    fullfilled: false,
    user_id: 5,
    lng: center_point[:lng] + rand(-1.00..1.00),
    lat: center_point[:lat] + rand(-1.00..1.00)
  )
end