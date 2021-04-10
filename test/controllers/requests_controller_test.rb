require 'test_helper'

class RequestsControllerTest < ActionDispatch::IntegrationTest

  setup do
    @jwt_token = sign_up
    @request = Request.create({ id: 1,
                                rtype: "1",
                                description: (str = "0" * 21),
                                fullfilled: "1",
                                showOnMap: "1",
                                lat: "11",
                                lng: "22",
                                user_id: 1 })
  end
  
  test "should get index" do
    get requests_url, headers: { "Authorization" => "Bearer #{@jwt_token}"}
    assert_response :success
  end

  test "should create request" do
    assert_difference('Request.count') do
      post requests_url, params: { rtype: "1",
                                   description: (str = "0" * 21),
                                   fullfilled: "1",
                                   showOnMap: "1",
                                   lat: "11",
                                   lng: "22",
                                   user_id: 1 }, 
                         headers: { "Authorization" => "Bearer #{@jwt_token}"}
    end
  end

  test "should show request" do
    Request.all.each do |x|
      get requests_url(x), headers: { "Authorization" => "Bearer #{@jwt_token}"}
      assert_response :success
    end
  end

  test "should update request" do
    put requests_url+"/1", params: { fullfilled: 0,
                                     showOnMap: 1
                                    }, 
                           headers: { "Authorization" => "Bearer #{@jwt_token}"}
    assert_response :success
    assert_equal( false, Request.first.fullfilled )
  end

end
