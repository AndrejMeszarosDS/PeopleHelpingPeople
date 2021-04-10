class CreateRequests < ActiveRecord::Migration[5.2]
  def change
    create_table :requests do |t|
      t.integer :rtype
      t.string :description
      t.boolean :fullfilled
      t.decimal :lat
      t.decimal :lng
      t.boolean :showOnMap

      t.references :user, foreign_key: true

      t.timestamps
    end
  end
end
