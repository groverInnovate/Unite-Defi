#!/bin/bash


cd ~/Unite-Defi/monad-backend/

echo "Processing fusion-sdk..."
cd cross-chain-sdk/fusion-sdk/ && \
pnpm install && \
pnpm build && \
cd ../../ 

echo "Processing cross-chain-sdk..."
cd cross-chain-sdk/ && \
pnpm install && \
pnpm build && \
cd .. 

echo "Processing monad-backend..."
pnpm install

echo "All steps completed successfully."