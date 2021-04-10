class CreateConversations < ActiveRecord::Migration[5.2]
  def change
    create_table :conversations do |t|
      t.references :responder, foreign_key: true
      t.references :user, foreign_key: true
      t.string :message
      t.boolean :unreaded

      t.timestamps
    end
  end
end
