package repository

import (
	"fmt"

	"github.com/edlanioj/imersao-fullcycle/codepix/domain/model"
	"github.com/jinzhu/gorm"
)

type TransactionRepositoryBd struct {
	Db *gorm.DB
}

func (t *TransactionRepositoryBd) Register(transaction *model.Transaction) error {
	err := t.Db.Create(transaction).Error

	if err != nil {
		return err
	}

	return nil
}

func (t *TransactionRepositoryBd) Save(transaction *model.Transaction) error {
	err := t.Db.Save(transaction).Error

	if err != nil {
		return err
	}

	return nil
}

func (t *TransactionRepositoryBd) Find(id string) (*model.Transaction, error) {
	var transaction model.Transaction

	t.Db.Preload("AccountFrom.Bank").First(transaction, "id = ?", id)

	if transaction.ID == "" {
		return nil, fmt.Errorf("no transaction was found")
	}

	return &transaction, nil

}
