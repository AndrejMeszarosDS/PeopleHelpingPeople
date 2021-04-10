require 'test_helper'

class ConversationsControllerTest < ActionDispatch::IntegrationTest
  
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
    @conversation = Conversation.create ({ id: 1,
                                           responder_id: 1,
                                           user_id: 1,
                                           message: "Hello",
                                           unreaded: false })
  end
  
  test "should get index" do
    get conversations_url, headers: { "Authorization" => "Bearer #{@jwt_token}"}
    assert_response :success
  end

  test "should create conversation" do
    assert_difference('Conversation.count') do
      post conversations_url, params: { responder_id: 1,
                                        user_id: 1,
                                        message: "Hello",
                                        unreaded: false}, 
                              headers: { "Authorization" => "Bearer #{@jwt_token}"}
    end
  end

  test "should show conversation" do
    Request.all.each do |x|
      get conversations_url(x), headers: { "Authorization" => "Bearer #{@jwt_token}"}
      assert_response :success
    end
  end

end
