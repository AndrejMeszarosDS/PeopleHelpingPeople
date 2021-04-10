require 'test_helper'

class ResponderTest < ActiveSupport::TestCase

  def setup
    @user = User.create(:first_name => 'Firstname',
                     :last_name  => 'Lastname',
                     :email => 'test@example.com',
                     :password => 'password',
                     :lat => 11,
                     :lng => 22,
                     :id => 1 )

    @request = Request.create( :rtype => 1,
                     :description => '12345678901234567890',
                     :fullfilled => true,
                     :lat => 11,
                     :lng => 22,
                     :user_id => 1,
                     :showOnMap => false,
                     :id => 1)
  end

  test "volunteer wrong value" do
    @responder = Responder.new( :request_id => 1,
                            :user_id => 1,
                            :volunteer => '')
    assert @responder.invalid?
  end

end
