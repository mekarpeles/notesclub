class AddGinIndexToTopicsContent < ActiveRecord::Migration[6.0]
  disable_ddl_transaction! # Otherwise, read and write opperations will be blocked until the migration finishes

  def change
    enable_extension 'btree_gin'

    add_index :topics, :content, using: :gin, algorithm: :concurrently
  end
end
