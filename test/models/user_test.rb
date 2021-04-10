require 'test_helper'

class UserTest < ActiveSupport::TestCase
  
  test "first_name too short" do
    @user = User.new(:first_name => '12',
                     :last_name  => 'Lastname',
                     :email => 'test@example.com',
                     :password => 'password',
                     :lat => 22,
                     :lng => 11 )
                
    assert @user.invalid?
  end
  
  test "first_name too long" do
    @user = User.new(:first_name => (str = "0" * 21),
                     :last_name  => 'Lastname',
                     :email => 'test@example.com',
                     :password => 'password',
                     :lat => 22,
                     :lng => 11 )
                
    assert @user.invalid?
  end

  test "last_name too short" do
    @user = User.new(:first_name => 'Firstname',
                     :last_name  => '12',
                     :email => 'test@example.com',
                     :password => 'password',
                     :lat => 22,
                     :lng => 11 )
                
    assert @user.invalid?
  end
  
  test "last_name too long" do
    @user = User.new(:first_name => 'Firstname',
                     :last_name  => (str = "0" * 21),
                     :email => 'test@example.com',
                     :password => 'password',
                     :lat => 22,
                     :lng => 11 )
                
    assert @user.invalid?
  end

  test "email too long" do
    @user = User.new(:first_name => 'Firstname',
                     :last_name  => 'Lastname',
                     :email => '7890123456789012345678901test@example.com',
                     :password => '123456',
                     :lat => 22,
                     :lng => 11 )
    assert @user.invalid?
  end

  test "email duplicity" do
    @user = User.create(:first_name => 'Firstname',
                     :last_name  => 'Lastname',
                     :email => 'test@example.com',
                     :password => 'password',
                     :lat => 22,
                     :lng => 11 )
    @user = User.new(:first_name => 'Firstname',
                     :last_name  => 'Lastname',
                     :email => 'test@example.com',
                     :password => 'password',
                     :lat => 22,
                     :lng => 11 )

    assert @user.invalid?
  end

  test "password too short" do
    @user = User.new(:first_name => 'Firstname',
                     :last_name  => 'Lastname',
                     :email => 'test@example.com',
                     :password => (str = "0" * 5),
                     :lat => 22,
                     :lng => 11 )
                
    assert @user.invalid?
  end
  
  test "password too long" do
    @user = User.new(:first_name => 'Firstname',
                     :last_name  => 'Lastname',
                     :email => 'test@example.com',
                     :password => (str = "0" * 11),
                     :lat => 22,
                     :lng => 11 )
                
    assert @user.invalid?
  end

  test "latitude presence" do
    @user = User.new(:first_name => 'Firstname',
                     :last_name  => 'Lastname',
                     :email => 'test@example.com',
                     :password => 'password',
                     :lat => '',
                     :lng => 11 )
                
    assert @user.invalid?
  end

  test "longitude presence" do
    @user = User.new(:first_name => 'Firstname',
                     :last_name  => 'Lastname',
                     :email => 'test@example.com',
                     :password => 'password',
                     :lat => 22,
                     :lng => '' )
                
    assert @user.invalid?
  end

end
