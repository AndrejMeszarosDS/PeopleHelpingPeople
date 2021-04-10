class CreateResponders < ActiveRecord::Migration[5.2]
  def change
    create_table :responders do |t|
      t.references :request, foreign_key: true
      t.references :user, foreign_key: true
      t.boolean :volunteer

      t.timestamps
    end
  end
end
