require 'test_helper'

class RespondersControllerTest < ActionDispatch::IntegrationTest

  setup do
    @jwt_token = sign_up
    @request = Request.create({ id: 1,
                                rtype: 1,
                                description: (str = "0" * 21),
                                fullfilled: true,
                                showOnMap: true,
                                lat: 11,
                                lng: 22,
                                user_id: 1 })
    @responder = Responder.create ({ id: 1,
                                     request_id: 1,
                                     user_id: 1,
                                     volunteer: false })
  end
  
  test "should get index" do
    get responders_url, headers: { "Authorization" => "Bearer #{@jwt_token}"}
    assert_response :success
  end

  test "should create responder" do
    assert_difference('Responder.count') do
      post responders_url, params: { request_id: 1,
                                     user_id: 1,
                                     volunteer: false }, 
                           headers: { "Authorization" => "Bearer #{@jwt_token}"}
    end
  end

  test "should show responder" do
    Request.all.each do |x|
      get responders_url(x), headers: { "Authorization" => "Bearer #{@jwt_token}"}
      assert_response :success
    end
  end

  test "should update responder" do
    put responders_url+"/1", params: { state: true }, 
                             headers: { "Authorization" => "Bearer #{@jwt_token}"}
    assert_response :success
    assert_equal( true, Responder.first.volunteer )
  end

end
