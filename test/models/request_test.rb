require 'test_helper'

class RequestTest < ActiveSupport::TestCase

  def setup
    @user = User.create(:first_name => "Firstname",
                     :last_name  => 'Lastname',
                     :email => 'test@example.com',
                     :password => 'password',
                     :lat => 11,
                     :lng => 22,
                     :id => 1 )
  end

  # rtype presence 
  test "rtype presence not checked" do
    @request = Request.new( :rtype => '',
                            :description => (str = "0" * 30),
                            :fullfilled => true,
                            :lat => 11,
                            :lng => 22,
                            :user_id => 1,
                            :showOnMap => false)
    assert @request.invalid?
  end
  # description
  test "description too short" do
    @request = Request.new( :rtype => 1,
                            :description => (str = "0" * 19),
                            :fullfilled => true,
                            :lat => 11,
                            :lng => 22,
                            :user_id => 1,
                            :showOnMap => false)
    assert @request.invalid?
  end
  # description
  test "description too long" do
    @request = Request.new( :rtype => 1,
                            :description => (str = "0" * 301),
                            :fullfilled => true,
                            :lat => 11,
                            :lng => 22,
                            :user_id => 1,
                            :showOnMap => false)
    assert @request.invalid?
  end
  # fullfilled
  test "fullfilled wrong value" do
    @request = Request.new( :rtype => 1,
                            :description => (str = "0" * 30),
                            :fullfilled => '',
                            :lat => 11,
                            :lng => 22,
                            :user_id => 1,
                            :showOnMap => false)
    assert @request.invalid?
  end
  # lat
  test "lat not present" do
    @request = Request.new( :rtype => 1,
                            :description => (str = "0" * 30),
                            :fullfilled => true,
                            :lat => '',
                            :lng => 22,
                            :user_id => 1,
                            :showOnMap => false)
    assert @request.invalid?
  end
  # lng
  test "lng not present" do
    @request = Request.new( :rtype => 1,
                            :description => (str = "0" * 30),
                            :fullfilled => true,
                            :lat => 11,
                            :lng => '',
                            :user_id => 1,
                            :showOnMap => false)
    assert @request.invalid?
  end
  # showOnMap
  test "showOnMap wrong value" do
    @request = Request.new( :rtype => 1,
                            :description => (str = "0" * 30),
                            :fullfilled => true,
                            :lat => 11,
                            :lng => 22,
                            :user_id => 1,
                            :showOnMap => '')
    assert @request.invalid?
  end

end
