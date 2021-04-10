require 'test_helper'

class ConversationTest < ActiveSupport::TestCase
  def setup
    @user = User.create(:first_name => 'Firstname',
                     :last_name  => 'Lastname',
                     :email => 'test@example.com',
                     :password => 'password',
                     :lat => 11,
                     :lng => 22,
                     :id => 1)

    @request = Request.create( :rtype => 1,
                     :description => '12345678901234567890',
                     :fullfilled => true,
                     :lat => 11,
                     :lng => 11,
                     :user_id => 1,
                     :showOnMap => 'false',
                     :id => 1)
    @responder = Responder.create( :request_id => 1,
                     :user_id => 1,
                     :volunteer => true,
                     :id => 1)
  end

  # message empty
  test "message empty" do
    @conversation = Conversation.new( :user_id => 1,
                                      :responder_id => 1,
                                      :message => '',
                                      :unreaded => false)
    assert @conversation.invalid?
  end
  # message too long
  test "message long" do
    @conversation = Conversation.new( :user_id => 1,
                                      :responder_id => 1,
                                      :message => (str = "0" * 201),
                                      :unreaded => false)
    assert @conversation.invalid?
  end
  # unreaded wrong value
  test "unreaded wrong value" do
    @conversation = Conversation.new( :user_id => 1,
                                      :responder_id => 1,
                                      :message => (str = "0" * 5),
                                      :unreaded => '')                                 
    assert @conversation.invalid?
  end

end
