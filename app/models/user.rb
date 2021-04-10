class User < ApplicationRecord
    has_secure_password
    has_one_attached :gaID
    has_many :request, dependent: :destroy
    has_many :responders, dependent: :destroy
    
    validates :first_name, presence: true, length: {minimum: 3, maximum: 20}
    validates :last_name, presence: true, length: {minimum: 3, maximum: 20}
    validates :email, presence: true, uniqueness: { case_sensitive: false },length: {maximum: 40}, :if => :email
    validates_format_of :email,:with => /\A[^@\s]+@([^@\s]+\.)+[^@\s]+\z/
    validates :password, length: {minimum: 6, maximum: 10}, :if => :password
    validates :lat, presence: true
    validates :lng, presence: true
    validate :gaID, :if => :gaID
    
    def to_token_payload
      {
        sub: id,
        first_name: first_name,
        last_name: last_name
      }
    end
end
