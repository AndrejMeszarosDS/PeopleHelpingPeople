class Request < ApplicationRecord
  belongs_to :user
  has_many :responder , dependent: :destroy

  validates :rtype, presence: true
  validates :description, length: { in: 20..300 }
  validates :fullfilled, inclusion: { in: [true, false] }
  validates :lat, presence: true
  validates :lng, presence: true
  validates :showOnMap, inclusion: { in: [true, false] }
 end
