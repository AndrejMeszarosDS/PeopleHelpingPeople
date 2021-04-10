class Conversation < ApplicationRecord
  include ActionView::Helpers::DateHelper
  belongs_to :responder
  belongs_to :user
  default_scope -> { order(created_at: :desc) }

  validates :message, length: { in: 1..200 }
  validates :unreaded, inclusion: { in: [true, false] }

  def self.search( responderID)
    self.where("responder_id = ?", responderID)
  end

  def posted_on
    time_ago_in_words(self.created_at)
  end

end
