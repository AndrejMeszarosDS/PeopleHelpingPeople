ENV['RAILS_ENV'] ||= 'test'
require_relative '../config/environment'
require 'rails/test_help'

class ActiveSupport::TestCase

  # creates user for authentication tests
  def sign_up
    @user = User.create( first_name: "Firstname",
                         last_name: "Lastname",
                         email: "1@user.com",
                         password: "password",
                         lat: "11",
                         lng: "22",
                         id: "1" )
  # generates jwt token for controller tests
    post user_token_url({
      auth: {
        email: "1@user.com",
        password: "password"
            }
    })

    @response_jwt = JSON.parse(@response.body)["jwt"]

  end

end
