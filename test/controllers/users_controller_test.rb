require 'test_helper'

class UsersControllerTest < ActionDispatch::IntegrationTest

  setup do
    @jwt_token = sign_up
  end
  
  test "should get index" do
    get users_url, headers: { "Authorization" => "Bearer #{@jwt_token}"}
    assert_response :success
  end

  test "should create user" do
    assert_difference('User.count') do
      post users_url, params: { user: { first_name: "Firstname",
                            last_name: "Lastname",
                            email: "2@user.com",
                            password: "password",
                            lat: "11",
                            lng: "22" }}
    end
  end

  test "should show user" do
    User.all.each do |x|
      get users_url(x), headers: { "Authorization" => "Bearer #{@jwt_token}"}
      assert_response :success
    end
  end

  test "should update user" do
    put users_url+"/1", params: { first_name: "Newname",
                                  last_name: "Lastname",
                                  password: "password",
                                  old_password: "password",
                                  lat: "11",
                                  lng: "22",
                                  gaID: "" },
    headers: { "Authorization" => "Bearer #{@jwt_token}"}
    assert_response :success
    assert_equal( "Newname", User.first.first_name )
  end

  test "should destroy user" do
    assert_difference('User.count', -1) do
        delete users_url+"/1", params: { old_password: "password" },
                               headers: { "Authorization" => "Bearer #{@jwt_token}"}
    end
  end
  
end
