class Responder < ApplicationRecord
  belongs_to :request
  belongs_to :user
  has_many :conversation, dependent: :destroy

  validates :volunteer, inclusion: { in: [true, false] }
end
